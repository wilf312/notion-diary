module.exports = {
  h1: (text) => ({
    type: "heading_1",
    heading_1: {
      rich_text: [
        {
          type: "text",
          text: {
            content: text,
          },
        },
      ],
    },
  }),

  h2: (text) => ({
    type: "heading_2",
    heading_2: {
      rich_text: [
        {
          type: "text",
          text: {
            content: text,
          },
        },
      ],
    },
  }),

  todo: () => ({
    type: "to_do",
    to_do: {
      rich_text: [
        {
          type: "text",
          text: {
            content: "",
            link: null,
          },
        },
      ],
      checked: false,
      color: "default",
    },
  }),

  list: () => ({
    type: "bulleted_list_item",
    bulleted_list_item: {
      rich_text: [
        {
          type: "text",
          text: {
            content: "",
            link: null,
          },
        },
      ],
    },
  }),
};
