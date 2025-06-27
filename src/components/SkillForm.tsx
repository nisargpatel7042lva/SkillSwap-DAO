import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccount } from "wagmi";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SUPPORTED_TOKENS } from '@/lib/paymentUtils';

interface SkillFormProps {
  onSkillCreated: () => void;
  onCancel: () => void;
}

export const SkillForm = ({ onSkillCreated, onCancel }: SkillFormProps) => {
  const { address } = useAccount();
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    price: string;
    category: string;
    illustration_url: string;
    token_symbol: string;
  }>({
    title: "",
    description: "",
    price: "",
    category: "",
    illustration_url: "",
    token_symbol: SUPPORTED_TOKENS[0].symbol
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setErrorMsg(null);
    try {
      // Local preview
      setLocalImagePreview(URL.createObjectURL(file));
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { data, error } = await supabase.storage.from('skill-images').upload(fileName, file);
      if (error) {
        if (error.message.includes('bucket')) {
          throw new Error('Image upload bucket missing or not public. Please check Supabase storage settings.');
        }
        throw error;
      }
      const { data: publicUrlData } = supabase.storage.from('skill-images').getPublicUrl(fileName);
      setFormData((prev) => ({ ...prev, illustration_url: publicUrlData.publicUrl }));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setErrorMsg(errorMessage);
      setLocalImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!address) return;
    if (!formData.title.trim() || !formData.description.trim() || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("skills")
        .insert({
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          illustration_url: formData.illustration_url || null,
          user_id: address,
          token_symbol: formData.token_symbol
        });
      if (error) {
        setErrorMsg(error.message || 'Failed to list skill');
        toast.error(error.message || 'Failed to list skill');
        return;
      }
      toast.success("Skill listed successfully!");
      onSkillCreated();
      setFormData({ title: "", description: "", price: "", category: "", illustration_url: "", token_symbol: SUPPORTED_TOKENS[0].symbol });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while listing the skill';
      setErrorMsg(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-gray-300 bg-blue-50">
      <CardHeader>
        <CardTitle>List a New Skill</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Skill title"
              className="border-2 border-dashed border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Skill description"
              rows={3}
              className="border-2 border-dashed border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price (in {formData.token_symbol}) *</label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value.replace(/^0+(?=\d)/, '') })}
              placeholder={`Enter price in ${formData.token_symbol}`}
              className="border-2 border-dashed border-gray-300"
              required
              min={0}
              step="any"
            />
            <span className="text-xs text-gray-500">You can enter small values, e.g., 0.00001 ETH. No leading zeros.</span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Token *</label>
            <select
              value={formData.token_symbol}
              onChange={(e) => setFormData({ ...formData, token_symbol: e.target.value })}
              className="border-2 border-dashed border-gray-300 rounded px-3 py-2 w-full"
              required
            >
              {SUPPORTED_TOKENS.map(token => (
                <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="border-2 border-dashed border-gray-300">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Programming">Programming</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Writing">Writing</SelectItem>
                <SelectItem value="Languages">Languages</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Music">Music</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              className="border-2 border-dashed border-gray-300 rounded px-3 py-2 w-full"
            />
            {localImagePreview && (
              <div className="mb-2 mt-2">
                <img
                  src={localImagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded border border-dashed border-gray-300"
                />
                <div className="text-xs text-gray-500">Image preview</div>
              </div>
            )}
            {errorMsg && <div className="text-xs text-red-500 mt-1">{errorMsg}</div>}
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isSubmitting ? "Listing..." : "List Skill"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="border-2 border-dashed border-gray-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 