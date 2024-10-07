import NominatortorInfo from "../../../../components/nominator-info";

export default function NominatorPage({
  params: { id },
}: {
  params: { id: string };
}) {
  // JSX로 GraphComponent를 렌더링
  return (
    <div>
      <NominatortorInfo address_id={id} />
    </div>
  );
}
