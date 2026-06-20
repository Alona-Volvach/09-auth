import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NoteDetails from "./NoteDetails.client";
import { Metadata } from "next";
import { getServerNoteById } from "@/lib/api/serverApi";


interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const note = await getServerNoteById(id);

  const title = `Note ${note.title}`;
  const description = `Read and manage your note titled "${note.title}". Stay organized with NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://09-auth-theta-two.vercel.app/${id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `NoteHub note ${id} preview`,
        },
      ],
    },
  };
}

export default async function NoteDetailsPage({ params }: Props) {
  const queryClient = new QueryClient();
  const { id } = await params;

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => getServerNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetails />
    </HydrationBoundary>
  );
}