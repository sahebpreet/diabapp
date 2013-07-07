$(document).ready(function() 
{
		var db;
		var storeName="diab";
		//var indexedDB = (window.indexedDB || window.mozIndexedDB);
		var openDb=function()
		{
			var request=indexedDB.open("diabetore",2);
			request.onsuccess = function()
			{
				console.log("DB created succcessfully");
				db = request.result;
				console.log("openDB done!!");
				return db;
			};
        
			
			request.onerror=function(){
				alert("could not open db");
			};
			
			request.onupgradeneeded = function()
			{ 
				var db= request.onsuccess();
				
				console.log("openDB.onupgradeneeded function");
				var store = db.createObjectStore(storeName, {keyPath: 'date'});
				var dateIndex = store.createIndex("date", "date",{unique: true});
  
				// Populate with initial data.
				store.put({date: "june 1 2013",pre:70,post:70});
				store.put({date: "june 2 2013",pre:71,post:87});
				store.put({date: "june 3 2013",pre:72,post: 76});
				store.put({date: "june 8 2013",pre:73,post:75});
			};   
		};
		
		function getObjectStore(store_name,mode)
		{
			var tx=db.transaction(store_name,mode);
			return tx.objectStore(store_name);
		}
		
		function addItems(date,pre,post)
		{
			console.log("addition to db started");
			var obj={date:date,pre:pre,post:post};
			var store=getObjectStore(storeName,'readwrite');
			var req;
			try
			{
				req=store.add(obj);
			}catch(e)
			{
				if(e.name=='DataCloneError')
				alert("This engine doesn't know how to clone");
				throw(e);
			}
			req.onsuccess=function(evt)
			{
				console.log("****Insertion in DB successful!!****");
				alert("entry successfully added");
			};
			req.onerror=function(evt)
			{
				console.log("Could not insert into DB");
			};
			
		}
		
		function getItems(date)
		{	
			console.log("retrieval started from db");
			console.log("in getItems date is: "+date);
			var hdate=new Date();
			
			var store=getObjectStore(storeName,"readonly");
			var obj={date:date};
			var index=store.index("date");
			
			var request=index.get(date);
			request.onsuccess=function()
			{
				var matching=request.result;
				if(matching !== undefined)
				{
					//report(matching.pre,matching.post);
					alert("Pre: "+matching.pre+ " , Post: "+matching.post);
					
			  	}else
					alert("Match Not Found");
				   //report (null);
			};
		
		}
		
		function showAll()
		{
			var objectStore = db.transaction(storeName).objectStore(storeName);

			objectStore.openCursor().onsuccess = function(event)
			{
				var cursor = event.target.result;
				if (cursor) 
				{
					console.log("Date" + cursor.value.date + "  Pre: " + cursor.value.pre +"  Post: " + cursor.value.post);
					cursor.continue();
				}
				else
				{
					alert("No more entries!");
				}
			};
			
		}
		 
		function clearObjectStore(store_name)
		{
			var store = getObjectStore(storeName, 'readwrite');
			var req = store.clear();
			req.onsuccess = function(evt) {
			alert("store cleared");
			//displayActionSuccess("Store cleared");
			//displayPubList(store);
		};
req.onerror = function (evt) {
console.error("clearObjectStore:", evt.target.errorCode);
displayActionFailure(this.error);
};
}

		 $("#add").click(function(){
				
				console.log("addEventListeners called...");
				
				console.log("add...");
				var date=document.getElementById('date').value;
				var pre=document.getElementById('pre').value;
				var post=document.getElementById('post').value;
				
				if(!date)
				{
					alert("required field missing..");
					return;
				}
				addItems(date,pre,post);
		  
		  });
		  
		  $("#show").click(function(){
		  
			console.log("eventlistner called for retrieval..");
			console.log("retrieve");
			
			var date=new Date().toDateString();
			date = $('#date').val();
			console.log("date entered is:"+ date);
			/*if(!date)
				{
					alert("required field missing..");
					return;
				}*/
			getItems(date);
		  });
		  
		  $("#showAll").click(function()
		  {
			
				console.log("eventlistner called for showAll...");
				console.log("showAll started...");
				showAll();
			
		  });
		  
		  $("#deleteall").click(function()
		  {
		  
			console.log("eventlistner called for deleting all entries..");
			
			var result=confirm ("do you really want to delete all the entries");
			if (result==true)
			{
				console.log("delete");
				var date=new Date().toDateString();
				date = $('#date').val();
				console.log("date entered is:"+ date);
				/*if(!date)
					{
						alert("required field missing..");
						return;
					}*/
				clearObjectStore(date);
			}
			else
			alert("deletion process cancelled...");
		});
        openDb();
        


});
    
        
