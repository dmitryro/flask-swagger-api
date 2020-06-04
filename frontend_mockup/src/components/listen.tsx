var words_counter = {};

const getActions = async (protocol, host, port,  endpoint, key) => {
    let url = `${protocol}://${host}:${port}/${endpoint}/${key}`;
    return await (await fetch(url)).json()
};


let run = async function () {
    var profile_key = 'GX-20101';
    var location = 'localhost';
    var endpoint = 'actions';
    var port = '80';
    var protocol = 'http';
   // Usage


    var v = await getActions(protocol, location, port, endpoint, profile_key);

    for(var i=0; i<v.length; i++) {
        var formfields = v[i].formfields;  
        var action_id = v[i].id;
        var rules = v[i].rules;

        for(var j=0; j<formfields.length; j++) {
            var field_id = formfields[j].field_id;

            try {
                var formfield = document.getElementById(`${field_id}`);

                if (formfield) {
                    formfield.addEventListener('keyup', monitor.bind(this, field_id, action_id, profile_key, rules), false);
                }
            } catch(err) {
                         console.log("Error assigning monitor to formfield "+err);
            }
        }
    }
    setInterval(run, 15000);
}

// Example POST method implementation:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache,
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade,
    body: JSON.stringify(data) // body data type must match "Content-Type"
  });
  return response.json(); // parses JSON response into native JavaScript
}

function publish_log(profile_key, log_type_code, severety, importance, word, action_id, field_id) {
    var host = 'localhost';
    var endpoint = 'logs';
    var port = '80';
    var protocol = 'http';
    let url = `${protocol}://${host}:${port}/${endpoint}`;
    var data = {
       "profile_key": profile_key,
       "severety": severety,
       "importance": importance,
       "log_type_code": log_type_code,
       "word": word,
       "action_id": action_id,
       "field_id": field_id
    };

    postData(url, data).then(data => {
        console.log("RULE SATISFIED - WE SENT "+data); // JSON data parsed by `response.json()` call
    });


    return false;
}

function monitor(field_id, action_id, profile_key, rules, event) {
    var formfield = document.getElementById(`${field_id}`);
    console.log("Triggered monitor ..."+JSON.stringify(event)+' --  '+`${field_id}`);

    for(var i=0; i<rules.length; i++) {
       const inputElement: HTMLInputElement = document.getElementById(`${field_id}`) as HTMLInputElement;
       const inputValue: string = inputElement.value
       var field = inputValue.trim();
       var res = rules[i].code.split(" ");
       var rule = res[0].toString().trim();
       var word = res[1].toString().trim();
       var name = rules[i].name;
       //var n = field.localeCompare(word);

       if (field.includes(word) && !words_counter[word]) {
               publish_log(profile_key, "AL", rules[i].severety, rules[i].severety, word, action_id, field_id)                
               words_counter[word] = 1;
               var node = document.createElement("div");                 // Create a <li> node
               var textnode = document.createTextNode("TEXT DETECTED - severety"+rules[i].severety);         // Create a text node
               node.appendChild(textnode);                              // Append the text to
               document.getElementById("bio").appendChild(node);     // Append <div> 

       } else {
               if (field.includes(word)) {
                   words_counter[word]++;
               }
               console.log("WORD COUNTER FOR "+`${word}`+" IS "+words_counter[word]);
               console.log("RULE "+`${rule}`+" IS NOT SATISFIED IN "+`${field}`+" FOR THE WORD "+`${word}`);
       }
    }
    event.preventDefault();
    return false;
}

export default run;
