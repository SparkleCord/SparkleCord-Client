// this system is going to be used in an upcoming update, but in a different way

const PATH = "./js/[].js";
const scripts = {
  //  root: ["test"],
}

for (const [folder, names] of Object.entries(scripts)) {
    let addition = `${folder}/`;
    if (folder === "root") addition = "";
    names.forEach(name => {
        const script = document.createElement("script");
        script.src = PATH.replace("[]", addition + name);
        document.head.appendChild(script);
    });
}