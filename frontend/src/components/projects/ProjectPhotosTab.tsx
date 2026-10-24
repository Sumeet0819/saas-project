'use client';

import React, { useState } from 'react';
import { SitePhoto } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { createSitePhoto } from '../../store/slices/sitePhotosSlice';
import { Camera, MapPin, Tag, Plus, X, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectPhotosTabProps {
  projectId: string;
  photos: SitePhoto[];
}

export function ProjectPhotosTab({ projectId, photos }: ProjectPhotosTabProps) {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<SitePhoto | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    image_url: '',
    caption: '',
    location: '',
    ai_summary: '',
  });

  const handleUploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url.trim()) return;

    setSubmitting(true);
    try {
      await dispatch(
        createSitePhoto({
          project_id: projectId,
          image_url: formData.image_url.trim(),
          caption: formData.caption.trim() || undefined,
          location: formData.location.trim() || undefined,
          ai_summary: formData.ai_summary.trim() || undefined,
          ai_tags: ['#SiteInspection', '#CivilExecution'],
        })
      ).unwrap();
      setFormData({
        image_url: '',
        caption: '',
        location: '',
        ai_summary: '',
      });
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Failed to create site photo:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = photos.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchCaption = p.caption?.toLowerCase().includes(term);
    const matchLocation = p.location?.toLowerCase().includes(term);
    const matchSummary = p.ai_summary?.toLowerCase().includes(term);
    return !searchTerm || matchCaption || matchLocation || matchSummary;
  });

  const inputCls =
    'h-9 text-xs bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08] rounded-[8px] text-[#171A18] dark:text-[#EFF1F0] placeholder:text-[#929994] focus-visible:border-[#079B68] focus-visible:ring-[#079B68]/20 transition-colors';

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-3 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929994]" />
          <Input
            placeholder="Search by location, caption, or tags…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-9 ${inputCls}`}
          />
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="h-9 px-4 text-xs font-semibold bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] gap-1.5 cursor-pointer shadow-sm transition-colors shrink-0"
        >
          <Plus size={14} strokeWidth={2.25} /> Add Photo
        </Button>
      </div>

      {/* Photos Gallery */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] py-12 px-4 text-center">
          <div className="w-12 h-12 rounded-[10px] bg-[#E7F5EF] flex items-center justify-center mx-auto mb-3">
            <Camera size={22} className="text-[#079B68]" />
          </div>
          <h4 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] mb-1">No Site Photos Yet</h4>
          <p className="text-xs text-[#929994] max-w-sm mx-auto mb-4">
            {searchTerm
              ? 'No photos match your search. Try resetting search query.'
              : 'Add photo evidence for daily inspections, reinforcement cages, and safety snags.'}
          </p>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-8 px-4 text-xs font-semibold bg-[#079B68] hover:bg-[#087A55] text-white rounded-[7px] cursor-pointer"
          >
            Upload First Site Photo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((photo) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSelectedPhoto(photo)}
              className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
            >
              <div className="h-48 w-full bg-[#EEF0EF] dark:bg-white/[0.04] overflow-hidden relative">
                <img
                  src={photo.image_url}
                  alt={photo.caption || 'Site inspection photo'}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                {photo.location && (
                  <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 text-[10px] font-semibold bg-black/60 text-white backdrop-blur-sm px-2 py-0.5 rounded-[5px]">
                    <MapPin size={10} /> {photo.location}
                  </span>
                )}
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0] line-clamp-2 mb-1">
                    {photo.caption || 'Inspection capture'}
                  </p>
                  {photo.ai_summary && (
                    <div className="flex items-start gap-1 text-[11px] text-[#079B68] dark:text-[#0AAE78] mt-1 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.12)] p-1.5 rounded-[6px]">
                      <Sparkles size={11} className="shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{photo.ai_summary}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#E6E9E7] dark:border-white/[0.07] flex items-center justify-between text-[10px] text-[#929994]">
                  <span>{new Date(photo.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 font-medium text-[#079B68]">
                    <Tag size={10} /> Verified
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="bg-white dark:bg-[#1B1E1C] rounded-[12px] overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
              <div className="max-h-[60vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedPhoto.image_url}
                  alt={selectedPhoto.caption || 'Site inspection full view'}
                  className="max-h-[60vh] w-auto object-contain"
                />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">
                    {selectedPhoto.caption || 'Site Inspection Photo'}
                  </h4>
                  <span className="text-xs text-[#929994]">
                    {new Date(selectedPhoto.created_at).toLocaleString()}
                  </span>
                </div>
                {selectedPhoto.location && (
                  <p className="text-xs text-[#626A66] dark:text-[#9BA49E] flex items-center gap-1">
                    <MapPin size={12} className="text-[#079B68]" /> {selectedPhoto.location}
                  </p>
                )}
                {selectedPhoto.ai_summary && (
                  <div className="bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.12)] p-2.5 rounded-[8px] text-xs text-[#079B68]">
                    <strong>AI Analysis:</strong> {selectedPhoto.ai_summary}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Photo Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08] rounded-[12px] p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              Add Site Inspection Photo
            </DialogTitle>
            <p className="text-xs text-[#929994]">Attach photo evidence of site progress or safety verification.</p>
          </DialogHeader>

          <form onSubmit={handleUploadPhoto} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">Image URL *</Label>
              <Input
                required
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={formData.image_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                className={inputCls}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">Caption / Activity</Label>
              <Input
                placeholder="e.g. Column reinforcement bar inspection"
                value={formData.caption}
                onChange={(e) => setFormData((prev) => ({ ...prev, caption: e.target.value }))}
                className={inputCls}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">Location / Floor</Label>
              <Input
                placeholder="e.g. 3rd Floor, West Wing"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                className={inputCls}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">Notes / Summary</Label>
              <Input
                placeholder="e.g. Approved by PMC engineer before casting"
                value={formData.ai_summary}
                onChange={(e) => setFormData((prev) => ({ ...prev, ai_summary: e.target.value }))}
                className={inputCls}
              />
            </div>

            <DialogFooter className="pt-2 flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                disabled={submitting}
                className="h-9 px-4 text-xs rounded-[8px] cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !formData.image_url.trim()}
                className="h-9 px-4 text-xs font-semibold bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] cursor-pointer"
              >
                {submitting ? 'Saving…' : 'Add Photo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
