const { Client } = require("@notionhq/client");
const _ = require("lodash");
const { cdate } = require("cdate");
const { readFileSync } = require("node:fs");
const { exit } = require("node:process");
const { lexer } = require("markdown-to-notion");

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
  const GMT = new Date();
  const JST = cdate().tz("Asia/Tokyo");

  return {
    Name: {
      title: [{ type: "text", text: { content: JST.format(`YYYY/MM/DD`) } }],
    },
    Created: {
      date: {
        start: GMT.toISOString(),
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
  const markdownText = readFileSync(`./diary.md`, {
    encoding: `UTF-8`,
  });
  return [...lexer(markdownText)];
}

const main = async () => {
  await createPages();

  console.log("complete");
};
main();
