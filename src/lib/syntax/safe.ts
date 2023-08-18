export const safeAsync = async <T = unknown>(
  p: Promise<T>
): Promise<
  | [
      {
        status: "success";
        data: T;
      },
      null
    ]
  | [
      null,
      {
        status: "fail";
        error: any;
      }
    ]
> => {
  try {
    const data = await p;
    return [
      {
        status: "success",
        data,
      },
      null,
    ];
  } catch (error) {
    return [
      null,
      {
        status: "fail",
        error,
      },
    ];
  }
};

export const safeSync = <T = unknown>(
  op: T
):
  | [
      {
        status: "success";
        data: T;
      },
      null
    ]
  | [
      null,
      {
        status: "fail";
        error: any;
      }
    ] => {
  try {
    const data = op;
    return [
      {
        status: "success",
        data,
      },
      null,
    ];
  } catch (error) {
    return [
      null,
      {
        status: "fail",
        error,
      },
    ];
  }
};
