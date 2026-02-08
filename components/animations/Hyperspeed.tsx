"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export const Hyperspeed = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 3000;
        const posArray = new Float32Array(starsCount * 3);

        for (let i = 0; i < starsCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 1000;
        }

        starsGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
        const starsMaterial = new THREE.PointsMaterial({
            size: 0.7,
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
        });

        const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starsMesh);

        camera.position.z = 1;

        const animate = () => {
            requestAnimationFrame(animate);
            starsMesh.rotation.y += 0.0005;
            starsMesh.rotation.x += 0.0002;

            // Hyperspeed Effect: movement towards camera
            const positions = starsGeometry.attributes.position.array as Float32Array;
            for (let i = 0; i < starsCount; i++) {
                positions[i * 3 + 2] += 2.5; // Move towards camera
                if (positions[i * 3 + 2] > 500) {
                    positions[i * 3 + 2] = -500; // Reset to back
                }
            }
            starsGeometry.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 -z-10 bg-[#060010] overflow-hidden pointer-events-none"
        />
    );
};
