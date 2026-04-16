import { getContentBlocksForAdmin } from "@/lib/data/queries";
import { ContentBlockEditor } from "@/components/admin/content-block-editor";

export default async function AdminContentPage() {
  const blocks = await getContentBlocksForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Content Blocks</h1>
      <p className="mt-1 text-sm text-fg-secondary">
        Manage content that appears across the storefront — hero sections,
        announcements, and informational blocks.
      </p>

      <div className="mt-6 space-y-4">
        {blocks.length === 0 ? (
          <p className="text-sm text-fg-tertiary">No content blocks yet.</p>
        ) : (
          blocks.map((block: any) => (
            <ContentBlockEditor key={block.id} block={block} />
          ))
        )}
      </div>
    </div>
  );
}
