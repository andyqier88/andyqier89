 if (data.unionid) {
     console.log(data.unionid)
     fs.writeFile(unionidpath, datastr, function(error) {
         if (error) {
             throw err
         } else {
             var unionid = data.unionid
             console.log('saved');
         }
     })
 } else {
     fs.readFile(unionidpath, 'utf-8', function(error, data) {
         if (error) {
             console.log(error)
         } else {
             console.log('readFile')
             console.log(data.toString())
             var uni = data.toString()
             var unionids = JSON.parse(uni);
             var unionid = unionids.unionid
                 //res.render('commuity', {unionid })
             console.log(unionids.unionid)
         }

     })

 }
