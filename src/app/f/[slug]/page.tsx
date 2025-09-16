export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // const id = getForm(slug);

    return (
        <div>
            <h1>Form {slug}</h1>
        </div>
    )
}