const { Client } = require("@notionhq/client");
const _ = require("lodash");
const { cdate } = require("cdate");
const { exit } = require("node:process");

const env = {
  NOTION_KEY: process.env.NOTION_KEY,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
};

if (!env.NOTION_KEY || !env.NOTION_DATABASE_ID) {
  console.log(env);
  console.log(`環境変数が取れてません`);
  exit(1);
}

const notion = new Client({ auth: env.NOTION_KEY });
const databaseId = env.NOTION_DATABASE_ID;

/**
 * Creates new pages in Notion.
 *
 * https://developers.notion.com/reference/post-page
 *
 * @param {Array<{ number: number, title: string, state: "open" | "closed", comment_count: number, url: string }>} pagesToCreate
 */
async function createPages(pagesToCreate) {
  // const pagesToCreateChunks = _.chunk(pagesToCreate, OPERATION_BATCH_SIZE);
  // for (const pagesToCreateBatch of pagesToCreateChunks) {
  //   await Promise.all(
  //     pagesToCreateBatch.map((issue) =>
  //       notion.pages.create({
  //         parent: { database_id: databaseId },
  //         properties: getPropertiesFromDiary({
  //           title: `title`,
  //           number: `number`,
  //           state: `state`,
  //           comment_count: `comment_count`,
  //           url: `url`,
  //         }),
  //       })
  //     )
  //   );
  //   console.log(`Completed batch size: ${pagesToCreateBatch.length}`);
  // }
  return notion.pages.create({
    parent: { database_id: databaseId },
    properties: getPropertiesFromDiary({
      title: `title`,
      number: `number`,
      state: `state`,
      comment_count: `comment_count`,
      url: `url`,
    }),
    children: getContent(),
  });
  // console.log(`Completed batch size: ${pagesToCreateBatch.length}`);
}

/**
 * Returns the GitHub issue to conform to this database's schema properties.
 *
 * @param {{ number: number, title: string, state: "open" | "closed", comment_count: number, url: string }} issue
 */
function getPropertiesFromDiary(issue) {
  const { title, number, state, comment_count, url } = issue;

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
    // body: {
    //   title: [{ type: "text", text: { content: title } }],
    // },
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
