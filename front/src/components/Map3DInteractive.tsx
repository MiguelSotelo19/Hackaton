'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Parcela, MAP_CONFIG, getStarRating, formatCurrency, calculateImpactoAutos } from '@/lib/mapbox-config';
import { MapPin, X, Leaf, DollarSign, Award, Calendar, Plus } from 'lucide-react';

interface Map3DInteractiveProps {
    parcelas: Parcela[];
    onParcelaSelect?: (parcela: Parcela) => void;
    onAddToCart?: (parcela: Parcela) => void;
}

export default function Map3DInteractive({ parcelas, onParcelaSelect, onAddToCart }: Map3DInteractiveProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [mounted, setMounted] = useState(false);
    const [selectedParcela, setSelectedParcela] = useState<Parcela | null>(null);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!mounted || !mapContainer.current || map.current) return;

        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (!token) {
            console.error('❌ Token de Mapbox no encontrado');
            return;
        }

        mapboxgl.accessToken = token;
        console.log('🗺️ Inicializando mapa con', parcelas.length, 'parcelas');

        try {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: MAP_CONFIG.style ?? 'mapbox://styles/mapbox/satellite-streets-v12',
                center: MAP_CONFIG.center ?? [-99.2358, 18.7983],
                zoom: MAP_CONFIG.zoom ?? 12,
                pitch: MAP_CONFIG.pitch ?? 45,
                bearing: MAP_CONFIG.bearing ?? 0,
                antialias: true,
            });

            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
            map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

            map.current.on('load', () => {
                console.log('✅ Mapa cargado');
                setMapReady(true);

                setTimeout(() => map.current?.resize(), 300);
            });

            const handleResize = () => map.current?.resize();
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                map.current?.remove();
                map.current = null;
            };
        } catch (error) {
            console.error('❌ Error al crear mapa:', error);
        }
    }, [mounted]);

    useEffect(() => {
        if (!map.current || !mapReady) return;
        console.log('📍 Agregando capa de parcelas...');

        const geojson = {
            type: 'FeatureCollection',
            features: parcelas.map(parcela => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [parcela.lng, parcela.lat],
                },
                properties: {
                    id: parcela.id,
                    co2: parcela.co2_disponible,
                },
            })),
        };

        if (map.current.getSource('parcelas')) {
            const source = map.current.getSource('parcelas') as mapboxgl.GeoJSONSource;
            source.setData(geojson as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>);
            return;
        }

        map.current.addSource('parcelas', {
            type: 'geojson',
            data: geojson as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>,
        });

        map.current.addLayer({
            id: 'parcelas-layer',
            type: 'circle',
            source: 'parcelas',
            paint: {
                'circle-radius': 10,
                'circle-color': '#3b82f6',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
            },
        });

        // Evento de clic en el mapa (detecta clics sobre puntos)
        map.current.on('click', 'parcelas-layer', e => {
            const feature = e.features?.[0];
            if (!feature) return;
            const id = feature.properties?.id;
            const parcela = parcelas.find(p => p.id === Number(id));
            if (parcela) {
                setSelectedParcela(parcela);
                onParcelaSelect?.(parcela);
                map.current?.flyTo({
                    center: [parcela.lng, parcela.lat],
                    zoom: 15.5,
                    pitch: 60,
                    bearing: 30,
                    duration: 2000,
                });
            }
        });

        // Cambiar cursor al pasar sobre puntos
        map.current.on('mouseenter', 'parcelas-layer', () => {
            map.current!.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', 'parcelas-layer', () => {
            map.current!.getCanvas().style.cursor = '';
        });

        return () => {
            if (map.current?.getLayer('parcelas-layer')) {
                map.current.removeLayer('parcelas-layer');
                map.current.removeSource('parcelas');
            }
        };
    }, [mapReady, parcelas, onParcelaSelect]);


    const handleClose = () => {
        setSelectedParcela(null);
        map.current?.flyTo({
            center: MAP_CONFIG.center,
            zoom: MAP_CONFIG.zoom,
            pitch: MAP_CONFIG.pitch,
            bearing: 0,
            duration: 1500,
        });
    };

    const handleAddToCart = () => {
        if (selectedParcela && onAddToCart) {
            onAddToCart(selectedParcela);
            handleClose();
        }
    };

    if (!mounted) return null;

    return (
        <div className="relative w-full h-full">
            <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

            {!mapReady && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-indigo-900 flex items-center justify-center z-50">
                    <div className="text-center px-4">
                        <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6">
                            <div className="absolute inset-0 border-4 border-blue-400/30 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-white text-xl md:text-2xl font-bold mb-2">Cargando Mapa 3D</h3>
                        <p className="text-blue-300 text-sm md:text-base">Preparando vista satelital...</p>
                    </div>
                </div>
            )}

            {selectedParcela && (
                <div className="fixed inset-x-0 sm:pt-5 md:pt-0 md:absolute bottom-0 left-0 right-0 md:bottom-1 md:top-4 md:right-4 md:left-auto md:w-96 bg-white rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden z-40 animate-slideUp md:animate-slideIn max-h-[85vh] overflow-y-auto ">
                    <div className="relative h-48 md:h-56 ">
                        <img src={selectedParcela.foto} alt="Parcela" className="w-full h-full object-cover" />
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all backdrop-blur-sm active:scale-95"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                            <h2 className="text-xl md:text-2xl font-bold text-white">
                                Parcela #{selectedParcela.id}
                            </h2>
                            <p className="text-yellow-400 text-base">{getStarRating(selectedParcela.reputacion)}</p>
                        </div>
                    </div>

                    <div className="p-4 md:p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    <span className="text-blue-700 text-xs font-semibold">Hectáreas</span>
                                </div>
                                <p className="text-3xl font-black text-blue-900">{selectedParcela.hectareas}</p>
                            </div>

                            <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <Leaf className="w-4 h-4 text-indigo-600" />
                                    <span className="text-indigo-700 text-xs font-semibold">CO₂ Disponible</span>
                                </div>
                                <p className="text-3xl font-black text-indigo-900">{selectedParcela.co2_disponible}</p>
                                <p className="text-indigo-600 text-xs">toneladas</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <DollarSign className="w-5 h-5 text-purple-600" />
                                        <span className="text-purple-700 text-sm font-semibold">Precio/Tonelada</span>
                                    </div>
                                    <p className="text-3xl md:text-4xl font-black text-purple-900">
                                        {formatCurrency(selectedParcela.precio_por_tonelada)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-purple-600 text-xs">Valor Total</p>
                                    <p className="text-xl md:text-2xl font-bold text-purple-900">
                                        {formatCurrency(selectedParcela.precio_por_tonelada * selectedParcela.co2_disponible)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Award className="w-5 h-5 text-amber-600" />
                                <h4 className="font-bold text-gray-900">Certificaciones</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedParcela.certificaciones.map((cert, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-900"
                                    >
                                        {cert}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                                <Calendar className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className="text-xs text-gray-600">Experiencia</p>
                                    <p className="font-bold text-gray-900">{selectedParcela.anos_experiencia} años</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Agregar al Carrito
                        </button>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .custom-marker {
                    width: 48px;
                    height: 48px;
                    position: relative;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }
                .custom-marker:hover {
                    transform: scale(1.2);
                    z-index: 1000;
                }
                .custom-marker::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    border: 3px solid white;
                    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.7);
                }
                .marker-pulse {
                    position: absolute;
                    inset: -8px;
                    border-radius: 50% 50% 50% 0;
                    border: 2px solid rgba(59, 130, 246, 0.4);
                    transform: rotate(-45deg);
                    animation: pulse 2s ease-out infinite;
                }
                .marker-content {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(45deg);
                    color: white;
                    font-weight: bold;
                    font-size: 13px;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }
                @keyframes pulse {
                    0%, 100% {
                        transform: rotate(-45deg) scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: rotate(-45deg) scale(1.15);
                        opacity: 0.5;
                    }
                }
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
