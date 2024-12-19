import { ClientPage } from './page.client'

type Props = {
  params: { id: string }
}

export default async function Page({ params }: Props) {
  const { id } = params

  return <ClientPage bountyId={id} />
}
