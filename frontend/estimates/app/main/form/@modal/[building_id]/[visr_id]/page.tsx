import VisrModal from "@/components/Modal/VisrModal";
import { getVisrById } from "@/lib/api/getVisrById";

type Props = {
  params: { building_id: string; visr_id: string };
};

export default async function page({ params }: Props) {
  const visr_data = await getVisrById(params);

  if (!!!params.visr_id) {
    return null;
  }
  return <VisrModal visr_data={visr_data}></VisrModal>;
}
