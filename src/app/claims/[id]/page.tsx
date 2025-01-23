import { ClientPage } from './page.client'

interface Props {
  params: Promise<{ id: string }>
}

const Page = async ({ params }: Props) => {
  const { id } = await params

  return <ClientPage bountyId={id} />
}

export default Page
