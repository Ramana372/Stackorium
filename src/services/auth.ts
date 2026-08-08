import { supabase } from './supabase';
import type { Profile, AuthProvider } from '@/types';

export const PROFILE_IMAGES_BUCKET = 'profile-images';

function getProfileImageFolder(email: string) {
  return email.trim().toLowerCase();
}

function getFileExtension(file: File) {
  const match = file.type.match(/image\/(png|jpe?g|webp|gif|avif)$/);
  return match?.[1] === 'jpeg' ? 'jpg' : match?.[1] ?? 'webp';
}

async function fileToWebpBlob(file: File) {
  const imageUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error('Unable to load image for upload.'));
      element.src = imageUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Unable to process image upload.');

    context.drawImage(image, 0, 0);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (output) => {
          if (!output) {
            reject(new Error('Unable to convert image to WebP.'));
            return;
          }
          resolve(output);
        },
        'image/webp',
        0.9,
      );
    });

    return blob;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export function getAvatarStoragePath(email: string, file: File) {
  const fileName = `${crypto.randomUUID()}.${getFileExtension(file)}`;
  return `${getProfileImageFolder(email)}/${fileName}`;
}

export function getAvatarPathFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    const marker = `/storage/v1/object/public/${PROFILE_IMAGES_BUCKET}/`;
    const index = parsed.pathname.indexOf(marker);
    if (index === -1) return null;
    return parsed.pathname.slice(index + marker.length);
  } catch {
    return null;
  }
}

export async function uploadProfileAvatar(email: string, file: File) {
  const path = getAvatarStoragePath(email, file);
  const uploadFile = file.type === 'image/webp' ? file : await fileToWebpBlob(file);
  const objectName = file.type === 'image/webp' ? path : path.replace(/\.[^.]+$/, '.webp');

  const { error } = await supabase.storage
    .from(PROFILE_IMAGES_BUCKET)
    .upload(objectName, uploadFile, {
      upsert: true,
      contentType: 'image/webp',
      cacheControl: '3600',
    });

  if (error) {
    return { data: null, error };
  }

  const { data } = supabase.storage.from(PROFILE_IMAGES_BUCKET).getPublicUrl(objectName);
  return { data: { path: objectName, publicUrl: data.publicUrl }, error: null };
}

export async function deleteProfileAvatar(pathOrUrl: string) {
  const path = pathOrUrl.startsWith('http') ? getAvatarPathFromUrl(pathOrUrl) : pathOrUrl;
  if (!path) {
    return { error: null };
  }

  const { error } = await supabase.storage.from(PROFILE_IMAGES_BUCKET).remove([path]);
  return { error };
}

export async function signUp(
  email: string,
  password: string,
  fullName?: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${window.location.origin}/auth/verify`,
    },
  });

  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function sendPasswordReset(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/update-password`,
  });
  return { data, error };
}

export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({ password });
  return { data, error };
}

export async function signInWithOAuth(provider: AuthProvider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/progress`,
    },
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  return { data: data as Profile | null, error };
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'username' | 'full_name' | 'avatar_url' | 'bio' | 'github_url' | 'linkedin_url'>>,
) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  return { data: data as Profile | null, error };
}

export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
