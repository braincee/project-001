export const metadata = (data) => {
  const regexp = new RegExp("<meta.*?(|</meta)>", "g");
  let metaTagsContent = {};
  let metaTagsList = [];
  if (data) {
    metaTagsList = data.match(regexp);
    metaTagsList.map((tag) => {
      let nameRegexp = new RegExp(
        '((?<=name=")|(?<=property=")).*?(?=")',
        "g"
      );
      let contentRegexp = new RegExp('(?<=content=").*?(?=")', "g");
      let contentRegexp1 = new RegExp("<meta*?>(.*?)</meta>", "g");
      let name = tag.match(nameRegexp);
      let content = tag.match(contentRegexp);
      content = content || tag.match(contentRegexp1);
      if (name && content) {
        metaTagsContent = {
          ...metaTagsContent,
          [`${name[0]}`]: `${content[0]}`,
        };
      }
    });
  }
  return { metaTagsList, metaTagsContent };
};