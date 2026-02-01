interface Result<TNode, TCursor = unknown> {
  edges: {
    node: TNode;
    cursor: TCursor;
  }[];
  pageInfo: {
    endCursor: TCursor | number | null;
    hasNextPage: boolean;
  };
  totalCount: number;
}

const ResultFn = <TNode, TCursor = unknown>(props: Result<TNode, TCursor>) => {
  return {
    ...props,
  };
};

export default ResultFn;
