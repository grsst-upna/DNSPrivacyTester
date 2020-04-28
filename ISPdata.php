<?php
  session_set_cookie_params(300);
  session_start();
  session_regenerate_id();

//If validated exists and is equal to 1 we evaluate the results

  if(isset($_SESSION['validated'])){

      if($_SESSION['validated']==1){



        $dbdescr='mysql:dbname=db;host=dbserver;port=3306;charset=UTF8';

        try {

            $db= new PDO($dbdescr, 'user', 'password');

        } catch (PDOException $e) {

            die("failure while connecting to the database");

        }


          $ip=$_SERVER['REMOTE_ADDR'];

          //We see if the output of the test has been already decided for the IP to renovate the values only with different clients

          $stmt = $db  ->prepare( "SELECT ISP,compromise FROM dnsreq WHERE ip='$ip'" );
          $stmt ->execute();
          $datos=$stmt->fetch(PDO::FETCH_ASSOC);

          $comp=$_SESSION['plat'];

          $compromise=$_SESSION['veredict'];

          if($comp!="Nope" && $compromise!=2){

              $ISP=$datos['ISP'];

              if($ISP=="TELEFONICA"){
                $ISP="MOVISTAR";
              }

              $domain=$_GET['domain'];

              $id=$_SESSION[$domain];

              $r=$db -> prepare("UPDATE dnsreq SET compromise =$compromise WHERE id = '$id'");
              $r -> execute();


            //If results are not the same we update the table and if they are not registered we enter them


              if($datos['compromise']==null || intval($datos['compromise'])!=intval($compromise)){


              		$change=20;
                  if(intval($datos['compromise'])!=intval($compromise)){



                     $stmt = $db  ->prepare( "SELECT ISP,compromise FROM dnsreq WHERE ip='$ip' AND compromise=0" );
                     $stmt ->execute();
                     $cuenta_ncompromise=$stmt->rowCount();

                     $stmt = $db  ->prepare( "SELECT ISP,compromise FROM dnsreq WHERE ip='$ip' AND compromise=1" );
                     $stmt ->execute();
                     $cuenta_compromise=$stmt->rowCount();

                     $change=0;
                     if($cuenta_ncompromise<$cuenta_compromise){
                    	$change=1;
                     }
                   }






                  $stmt = $db  ->prepare( "SELECT compromise,ncompromise FROM ISPs WHERE ISPa='$ISP'" );
                  $stmt ->execute();
                  $datos_ISPs=$stmt->fetch(PDO::FETCH_ASSOC);


                  	if($datos['compromise']==null){
                  	$change=2;
                  	}


                    //We change the fields in the database depending on the results obtained during the test
                    if($compromise==1 && $change==2){

                      $nsp=$datos_ISPs['compromise']+1;
                      $r=$db -> prepare("UPDATE ISPs SET compromise =$nsp WHERE ISPa = '$ISP'");

                    }else if($compromise==0 && $change==2){
                      $nsp=$datos_ISPs['ncompromise']+1;
                      $r=$db -> prepare("UPDATE ISPs SET ncompromise =$nsp WHERE ISPa = '$ISP'");
                    }

                    if($change==1 && $datos['compromise']==0){

                    	$nsp=$datos_ISPs['compromise']+1;
                      	$r=$db -> prepare("UPDATE ISPs SET compromise =$nsp WHERE ISPa = '$ISP'");
                      	$r->execute();

                      	$nsp=$datos_ISPs['ncompromise']-1;
                      	$r=$db -> prepare("UPDATE ISPs SET ncompromise =$nsp WHERE ISPa = '$ISP'");

                    }

                    if($change==0 && $datos['compromise']==1){

                    	$nsp=$datos_ISPs['compromise']-1;
                      	$r=$db -> prepare("UPDATE ISPs SET compromise =$nsp WHERE ISPa = '$ISP'");
                      	$r->execute();

                      	$nsp=$datos_ISPs['ncompromise']+1;
                      	$r=$db -> prepare("UPDATE ISPs SET ncompromise =$nsp WHERE ISPa = '$ISP'");

                    }

                      $r->execute();
              }

            }

            $_SESSION['validated']=0;

            //We send the veredict to the javascritp file to comunicat the user the results

            if($compromise==1){
              die("POS");               //Positive
            }elseif($compromise==0){
              die("NEG");               //Negative
            }elseif($compromise==2){
              die("REP");               //Repeat the test
            }



  //If $_SESSION['validated']!=1 we just send the data that we collected from other users


  }else if(isset($_GET['time'])){

    $dbdescr='mysql:dbname=db;host=dbserver;port=3306;charset=UTF8';

    try {

        $db= new PDO($dbdescr, 'user', 'password');

    } catch (PDOException $e) {

        die("failure while connecting to the database");

    }



        $stmt = $db  ->prepare( "SELECT * FROM ISPs" );
        $stmt ->execute();
        $datos=$stmt->fetchAll(PDO::FETCH_ASSOC);


        $json=json_encode($datos);
        print($json);
    }
}


 ?>
