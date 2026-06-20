import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { NoteTag } from "@/types/note";
import NotesClientFilter from "./Notes.client";
import { Metadata } from "next";
import { fetchServerNotes } from "@/lib/api/serverApi";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] && slug[0] !== "all" ? (slug[0] as NoteTag) : "all";

  const title = `Filtered Notes — ${tag}`;
  const description = `View notes filtered by: ${tag}. Explore your organized note collection in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://09-auth-theta-two.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub filtered notes preview",
        },
      ],
    },
  };
}

export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  const tag = slug?.[0] && slug[0] !== "all" ? (slug[0] as NoteTag) : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { tag: tag ?? "all" }],
    queryFn: () =>
      fetchServerNotes({
        page: 1,
        perPage: 10,
        search: "",
        ...(tag ? { tag } : {}),
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClientFilter tag={tag ?? "all"} />
    </HydrationBoundary>
  );
}