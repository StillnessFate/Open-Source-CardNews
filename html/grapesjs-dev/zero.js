





element = document.getElementById('gjs-pn-commands');
element.innerHTML += "<input type=\"button\" value=\"버튼이름\" onClick=\"console.log(editor.getHtml())\">"
element.innerHTML += "<input type=\"button\" value=\"버튼이름\" onClick=\"console.log(editor.getCss())\">"

element.innerHTML += "<input type=\"button\" value=\"버튼이름\" onClick=\"console.log(editor.StorageManager.getStorages())\">"
element.innerHTML += "<input type=\"button\" value=\"버튼이름\" onClick=\"console.log(editor.getComponents())\">"
element.innerHTML += "<input type=\"button\" value=\"store\" onClick=\"console.log(editor.store())\">"
element.innerHTML += "<input type=\"button\" value=\"load\" onClick=\"console.log(editor.load())\">"


data=[{"type":"image","src":"http://placehold.it/350x250/78c5d6/fff/image1.jpg","unitDim":"px","height":350,"width":250},{"type":"image","src":"http://placehold.it/350x250/459ba8/fff/image2.jpg","unitDim":"px","height":350,"width":250},{"type":"image","src":"http://placehold.it/350x250/79c267/fff/image3.jpg","unitDim":"px","height":350,"width":250},{"type":"image","src":"http://placehold.it/350x250/c5d647/fff/image4.jpg","unitDim":"px","height":350,"width":250},{"type":"image","src":"http://placehold.it/350x250/f28c33/fff/image5.jpg","unitDim":"px","height":350,"width":250},{"type":"image","src":"http://placehold.it/350x250/e868a2/fff/image6.jpg","unitDim":"px","height":350,"width":250},{"type":"image","src":"http://placehold.it/350x250/cc4360/fff/image7.jpg","unitDim":"px","height":350,"width":250},{"type":"image","src":"http://grapesjs.com/img/work-desk.jpg","unitDim":"px","height":1080,"width":1728,"date":"2015-02-01"},{"type":"image","src":"http://grapesjs.com/img/phone-app.png","unitDim":"px","height":650,"width":320,"date":"2015-02-01"},{"type":"image","src":"http://grapesjs.com/img/bg-gr-v.png","unitDim":"px","height":1,"width":1728,"date":"2015-02-01"}]
element.innerHTML += "<input type=\"button\" value=\"load\" onClick=\"console.log(editor.StorageManager.load(data))\">"
