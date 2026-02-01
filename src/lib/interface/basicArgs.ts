interface BasicArgs {
  first: number;
  after?: string;
  filter: {
    search?: string;
    orderBy: string;
    sortBy: string;
  };
}

export default BasicArgs;
