new DOMParser()
  .parseFromString(
    await (
      await fetch(
        "https://gist.github.com/coolaj86/6f4f7b30129b0251f61fa7baaa881516",
      )
    ).text(),
    "text/html",
  )
  .documentElement.getElementsByTagName("body")[0].innerText;
