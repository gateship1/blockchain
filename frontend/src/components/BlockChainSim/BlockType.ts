export type BlockType = { blockid: number; parent: string; hash: string; dataval: string; 
                          nonce: number; timestamp: number; mined: boolean; difficulty: number,
                          maxIter: number; blockcolor: string };
export type BlockChangeMessage = { idx: number; data: BlockType };