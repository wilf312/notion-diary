const { Client } = require("@notionhq/client");
const _ = require("lodash");
const { cdate } = require("cdate");
const { exit } = require("node:process");

if (!process.env.NOTION_KEY || !process.env.NOTION_DATABASE_ID) {
  console.log(`環境変数が取れてません`);
  exit(1);
}

const notion = new Client({ auth: process.env.NOTION_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

/**
 * Creates new pages in Notion.
 *
 * https://developers.notion.com/reference/post-page
 *
 */
async function createPages() {
  return notion.pages.create({
    parent: { database_id: databaseId },
    properties: getPropertiesFromDiary(),
    children: getContent(),
  });
}

/**
 * Returns the GitHub issue to conform to this database's schema properties.
 *
 */
function getPropertiesFromDiary() {
  const date = new Date();
  const now = cdate();

  return {
    Name: {
      title: [{ type: "text", text: { content: now.format(`YYYY/MM/DD`) } }],
    },
    Created: {
      date: {
        start: date.toISOString(),
      },
    },
  };
}

/**
 * Returns the GitHub issue to conform to this database's schema properties.
 *
 * @param {{ number: number, title: string, state: "open" | "closed", comment_count: number, url: string }} issue
 */
function getContent() {
  return [
    // やりたいこと
    {
      type: "heading_1",
      heading_1: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "やりたいこと",
            },
          },
        ],
      },
    },

    {
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
    },

    // /やりたいこと

    // Done
    {
      type: "heading_1",
      heading_1: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "Done",
            },
          },
        ],
      },
    },
    // /Done

    // ChatGPT1日1問
    {
      type: "heading_2",
      heading_2: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "ChatGPT1日1問",
            },
          },
        ],
      },
    },

    // Happenings
    {
      type: "heading_2",
      heading_2: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "Happenings",
            },
          },
        ],
      },
    },
    {
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
    },
    // Happenings

    // 感謝
    {
      type: "heading_2",
      heading_2: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "感謝",
            },
          },
        ],
      },
    },
    {
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
    },
    // /感謝
  ];
}

const main = async () => {
  await createPages();

  console.log("complete");
};
main();
