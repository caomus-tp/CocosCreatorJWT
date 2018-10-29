<!-- Create a DOM object from a HTML file -->
<?php    
    if(file_exists("game.php"))
    {
      // echo ($_POST['username']);
      include "game.php";
    }
    else
    {
      echo 'Opps! File not found. Please check the path again';
    }
?>
