"use client";
import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { Box, Container } from "@chakra-ui/react"; // Chakra UI의 Box 및 Container 사용

// ForceGraph3D를 동적으로 로드
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false, // 서버사이드 렌더링을 비활성화
});

export function GraphComponent() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    // 샘플 데이터 로딩
    setData({
      nodes: [
        { id: "Node 1", img: "/resources/img/bifrost-logo.svg" },
        { id: "Node 2", img: "/resources/img/icon-pockie.svg" },
        { id: "Node 3", img: "/resources/img/icon-metamask.svg" },
      ],
      links: [
        { source: "Node 1", target: "Node 2" },
        { source: "Node 1", target: "Node 3" },
      ],
    });
  }, []);

  const textureLoader = new THREE.TextureLoader();

  // 화면 크기에 맞춰 그래프의 크기를 조정하는 함수
  const updateDimensions = () => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      setDimensions({ width, height });
    }
  };

  useEffect(() => {
    // 페이지 로드 시와 창 크기 변경 시 크기 조정
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <Container ref={containerRef} maxW="container.xl" height="600px">
      <Box width="100%" height="100%">
        <ForceGraph3D
          ref={graphRef}
          graphData={data}
          backgroundColor="#ffffff" // 배경을 흰색으로 설정
          width={dimensions.width} // 동적으로 계산된 너비 적용
          height={dimensions.height} // 동적으로 계산된 높이 적용
          nodeThreeObject={(node) => {
            // Create a sprite for each node
            const imgTexture = textureLoader.load(node.img);
            const material = new THREE.SpriteMaterial({ map: imgTexture });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(12, 12, 1); // Adjust the size of the image
            return sprite;
          }}
          nodeAutoColorBy="id"
          onNodeClick={(node) => alert(`Node: ${node.id}`)}
        />
      </Box>
    </Container>
  );
}

export default function NominatorPage({
  params: { id },
}: {
  params: { id: string };
}) {
  // JSX로 GraphComponent를 렌더링
  return (
    <div>
      <h1>Nominator ID: {id}</h1>
      <GraphComponent />
    </div>
  );
}
