const { Client } = require("@notionhq/client");
const _ = require("lodash");
const { cdate } = require("cdate");
const { exit } = require("node:process");
const text = require("./text");

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
    text.h1("やりたいこと"),
    text.todo(),
    // /やりたいこと

    // Done
    text.h1("Done"),

    // ChatGPT1日1問
    text.h2("ChatGPT1日1問"),

    // Happenings
    text.h2("Happenings"),
    text.list(),
    // Happenings

    // 感謝
    text.h2("感謝"),
    text.list(),
    // /感謝
  ];
}

const main = async () => {
  await createPages();

  console.log("complete");
};
main();
