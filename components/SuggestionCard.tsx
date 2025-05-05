"use client";

import React from 'react';

type SuggestionCardProps = {
  embedUrl: string;
  name: string;
  description: string;
  onOpen: () => void;
};

export default function SuggestionCard({ embedUrl, name, description, onOpen }: SuggestionCardProps) {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-gray-900 border border-gray-700">
      <iframe
        src={embedUrl}
        title={name}
        className="w-full h-48"
        frameBorder="0"
        allowFullScreen
      />
      <div className="p-4">
        <h4 className="text-white font-semibold text-lg mb-1">{name}</h4>
        <p className="text-gray-300 text-sm mb-4">{description}</p>
        <button
          onClick={onOpen}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Open Project in Alpha
        </button>
      </div>
    </div>
  );
} 