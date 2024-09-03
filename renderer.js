document.addEventListener("DOMContentLoaded", function (){
    document.getElementById('triggerDiv').addEventListener('click', function() {
        document.getElementById('myModal').style.display = 'block';
    });

    document.getElementById('closeBtn').addEventListener('click', function() {
        document.getElementById('myModal').style.display = 'none';
    });

})
