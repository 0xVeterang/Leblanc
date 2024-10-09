"use client";
import NominatortorInfo from "../../../../components/nominator-info";
import NodeGraph from "../../../../components/node-graph";
import React, { useState } from "react";
import Loading from "../../../../components/loading";
export default function NominatorPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const [nominatorData, setDataArray] = useState<any>(null); // 상태를 초기화합니다.

  // NominatortorInfo의 데이터를 가져오는 함수
  const handleDataUpdate = (data: any) => {
    console.log(data);
    setDataArray(data); // 받은 데이터를 상태에 설정합니다.
  };

  // JSX로 GraphComponent를 렌더링
  return (
    <div>
      <NominatortorInfo address_id={id} onDataUpdate={handleDataUpdate} />
      {/*nominatorData ? (
        <NodeGraph graphData={nominatorData} />
      ) : (
        <Loading /> // 데이터가 로드될 때까지 로딩 메시지 표시
      )*/}
    </div>
  );
}
