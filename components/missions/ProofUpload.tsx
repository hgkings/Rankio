"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Upload, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProofUploadProps {
    attemptId: string;
    onUploadComplete?: () => void;
}

export function ProofUpload({ attemptId, onUploadComplete }: ProofUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const supabase = createClient();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Lütfen bir dosya seçin');
            return;
        }

        setUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('Lütfen giriş yapın');
                return;
            }

            // Generate unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${attemptId}.${fileExt}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('proofs')
                .upload(fileName, file, {
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // Create proof record in database
            const { error: proofError } = await supabase
                .from('proofs')
                .insert({
                    attempt_id: attemptId,
                    user_profile_id: user.id,
                    file_path: fileName,
                    type: 'screenshot',
                    review_status: 'pending'
                });

            if (proofError) throw proofError;

            setUploaded(true);
            toast.success('Kanıt başarıyla yüklendi! 🎉');

            if (onUploadComplete) {
                onUploadComplete();
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.message || 'Yükleme başarısız oldu');
        } finally {
            setUploading(false);
        }
    };

    if (uploaded) {
        return (
            <div className="bg-green-500/10 border-2 border-green-500/20 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                <p className="text-lg font-black text-green-500">Kanıt Yüklendi!</p>
                <p className="text-sm text-slate-400">İçerik üreticisi tarafından incelenmeyi bekliyor</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* File Input */}
            <div className="relative">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="proof-upload"
                />
                <label
                    htmlFor="proof-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-primary/50 transition-colors bg-white/5"
                >
                    {preview ? (
                        <div className="relative w-full h-full p-4">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-contain rounded-xl"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                            <ImageIcon className="w-12 h-12" />
                            <div className="text-center">
                                <p className="font-bold">Ekran görüntüsü yüklemek için tıklayın</p>
                                <p className="text-sm">PNG, JPG veya JPEG (Max 5MB)</p>
                            </div>
                        </div>
                    )}
                </label>
            </div>

            {/* File Info */}
            {file && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{file.name}</p>
                            <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setFile(null);
                            setPreview(null);
                        }}
                        className="text-slate-400 hover:text-white"
                    >
                        Kaldır
                    </Button>
                </div>
            )}

            {/* Upload Button */}
            <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full h-14 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {uploading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Yükleniyor...
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Kanıtı Yükle
                    </div>
                )}
            </Button>
        </div>
    );
}
