import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Share2, X } from "lucide-react";
import {
  addShare,
  fetchSharedUsers,
  removeShare,
  ShareRole,
  SharedUser,
} from "./shares";

type Props = {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ShareDialog: React.FC<Props> = ({
  taskId,
  open,
  onOpenChange,
}) => {
  const [items, setItems] = useState<SharedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<ShareRole>("viewer");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSharedUsers(taskId);
      setItems(data);
    } catch (e: any) {
      setError(e.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, taskId]);

  const onAdd = async () => {
    if (!email.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await addShare(taskId, email.trim(), role);
      setEmail("");
      setRole("viewer");
      await load();
    } catch (e: any) {
      setError(e.message ?? "Failed to share");
    } finally {
      setSaving(false);
    }
  };

  const onRemove = async (userEmail: string) => {
    setSaving(true);
    setError(null);
    try {
      await removeShare(taskId, userEmail);
      await load();
    } catch (e: any) {
      setError(e.message ?? "Failed to revoke");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share access
          </DialogTitle>
        </DialogHeader>

        {error && <div className="text-sm text-destructive">{error}</div>}

        <div className="grid gap-3 md:grid-cols-[1fr_140px_auto]">
          <div className="space-y-1">
            <Label htmlFor="share-email">User email</Label>
            <Input
              id="share-email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="space-y-1">
            <Label>Permission</Label>
            <Select
              value={role}
              onValueChange={(v: ShareRole) => setRole(v)}
              disabled={saving}
            >
              <SelectTrigger>
                <SelectValue placeholder="viewer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">viewer (read-only)</SelectItem>
                <SelectItem value="editor">editor (can edit)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={onAdd} disabled={saving}>
              Allow
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Currently shared with</Label>
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : items.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No shared users yet
            </div>
          ) : (
            <ul className="divide-y rounded-md border">
              {items.map((u) => (
                <li
                  key={u.email}
                  className="flex items-center justify-between p-3"
                >
                  <div className="space-y-0.5">
                    <div className="font-medium">{u.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {u.role}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(u.email)}
                    title="Revoke access"
                    aria-label={`Revoke access for ${u.email}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
