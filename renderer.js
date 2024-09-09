document.addEventListener("DOMContentLoaded", function (){
    document.getElementById('triggerDiv').addEventListener('click', function() {
        document.getElementById('myModal').style.display = 'block';
    });

    document.getElementById('closeBtn').addEventListener('click', function() {
        document.getElementById('myModal').style.display = 'none';
    });

    document.getElementById('triggerDiv1').addEventListener('click', function() {
        document.getElementById('myModal1').style.display = 'block';
        window.api.send('get-all-patients');
    });

    document.getElementById('closeBtn1').addEventListener('click', function() {
        document.getElementById('myModal1').style.display = 'none';
    });

    document.getElementById('triggerDiv2').addEventListener('click', function() {
        document.getElementById('myModal2').style.display = 'block';
    });

    document.getElementById('closeBtn3').addEventListener('click', function() {
        document.getElementById('myModal2').style.display = 'none';
    });


})
