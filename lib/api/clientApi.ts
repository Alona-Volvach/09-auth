import { Note, NoteTag } from "@/types/note";
import { User } from "@/types/user";
import { nextServer } from "./api";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

interface FetchNotesParams {
  search?: string;
  tag?: NoteTag;
  page?: number;
  perPage?: number;
  sortBy?: SortBy;
}

type SortBy = "title" | "createdAt" | "updatedAt";

interface UserData {
  email: string;
  password: string;
}

interface SessionResponse {
  success: boolean;
}

interface UpdateUserData {
  email?: string;
  username?: string;
}

export async function fetchNotes(
  params?: FetchNotesParams
): Promise<FetchNotesResponse> {
  const response = await nextServer.get<FetchNotesResponse>("/notes", {
    params: params,
  });
  return response.data;
}

export async function createNote(
  createNoteData: CreateNoteData
): Promise<Note> {
  const res = await nextServer.post<Note>("/notes", createNoteData, {});
  return res.data;
}

export async function deleteNote(id: string): Promise<void> {
  await nextServer.delete<Note>(`/notes/${id}`);
}

export async function getNoteById(id: string): Promise<Note> {
  const res = await nextServer.get<Note>(`/notes/${id}`);
  return res.data;
}

export async function registerUser(userData: UserData): Promise<User> {
  const res = await nextServer.post<User>("/auth/register", userData);
  return res.data;
}

export async function loginUser(userData: UserData): Promise<User> {
  const res = await nextServer.post<User>("/auth/login", userData);
  return res.data;
}

export async function logoutUser(): Promise<void> {
  await nextServer.post("/auth/logout");
}

export async function checkSession(): Promise<SessionResponse> {
  const res = await nextServer.get("/auth/session");
  if (res.status === 200) {
    return { success: true };
  }
  return { success: false };
}

export async function getUser(): Promise<User> {
  const res = await nextServer.get("/users/me");
  return res.data;
}

export async function updateUser(userData: UpdateUserData): Promise<User> {
  const res = await nextServer.patch<User>("/users/me", userData);
  return res.data;
}