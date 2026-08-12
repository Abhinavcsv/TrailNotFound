interface DestinationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DestinationPage({
  params,
}: DestinationPageProps) {
  const { slug } = await params;

  return (
    <main className="p-10">
      Destination: {slug}
    </main>
  );
}
