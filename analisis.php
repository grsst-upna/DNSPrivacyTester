<?php

		//Generate a session to store variables
		session_set_cookie_params(300);
  	session_start();
  	session_regenerate_id();



		//Initialize MySQL database connection
  	 $dbdescr='mysql:dbname=database;host=server;port=00000;charset=UTF8';

        try {
          $db= new PDO($dbdescr, 'user', 'password');

        } catch (PDOException $e) {

            die("Error while connecting to the database");
        }


		//We make sure that the user is using a valid operating system, browser and has a domain assigned
    if(isset($_GET['domain']) && ($_SESSION['OS']=="Windows" || $_SESSION['OS']=="Android" || $_SESSION['OS']=="Macintosh") && ($_SESSION['browser']=="Chrome")){
    	$domain=$_GET['domain'];
    }
    else{
      die($_SESSION['browser']);
    }


		//If there was a test in progress
    if(isset($_SESSION[$domain])){

  		//We check if there has been enough time between tests to prevent possible attacks by DoS

    	if(isset($_SESSION['last_time'])){
       	 $past_time=$_SESSION['last_time'];
      	  $current_time=time();
      	  $time_differnece=$current_time-$past_time;
     	 }

			 //If the time passed is not enough we send a message for the JS to stop the program

     	if($time_differnece<5){
     		session_destroy();
     		die("NSDB");
     	}

			//We update the date the last sample was stored

      date_default_timezone_set('Europe/Madrid');
      $fecha = date("d")."-".date("m")."-".date("Y")." ".date("H").":".date("i").":".date("s");

      $tp=time();

      $code = $_SESSION[$domain];

      $r=$db -> prepare("UPDATE DNSusers SET TPFinal =$tp WHERE id = '$code'");
			try{
      	$r -> execute();
			}catch(Exception $e){
				die("NSDB");		//In case the user alters the cookie session
			}
      $r=$db -> prepare("UPDATE DNSusers SET FFinal ='$fecha' WHERE id = '$code'");
      $r -> execute();

      $archive="results/".$code.".txt"; //We create a variable with the name of the file to be written

  }else{

			//We query the MySQL database to see if there is already any data of the test being done

  	  $stmt = $db  ->prepare( "SELECT TPFinal FROM DNSusers WHERE domain='$domain'" );
      $stmt ->execute();
      $data=$stmt->fetch(PDO::FETCH_ASSOC);


			//If there is we do some comprobations to see if the user is trying to saturate the system
			//If there is no sign of that, we continue the test as before
      if($data!=null){

      	$_SESSION['time']=$data['TPFinal'];

        if(isset($_SESSION['time'])){
          $past_time=$_SESSION['time'];
          $current_time=time();
          $time_differnece=$current_time-$past_time;
        }

        if($time_differnece>6){
          $_SESSION['time']=time();
        }else{
          session_destroy();
          die("NSDB");
        }

        date_default_timezone_set('Europe/Madrid');
        $fecha = date("d")."-".date("m")."-".date("Y")." ".date("H").":".date("i").":".date("s");

        $tp=time();

        $code = $_SESSION[$domain];

        $r=$db -> prepare("UPDATE DNSusers SET TPFinal =$tp WHERE id = '$code'");
        $r -> execute();
        $r=$db -> prepare("UPDATE DNSusers SET FFinal ='$fecha' WHERE id = '$code'");
        $r -> execute();

        $archive="results/".$code.".txt";


      }else{
      	$ip=$_SERVER['REMOTE_ADDR'];

				//We do a comprobation of wether there have been more than 20 tests in the last half an hour to see if an IP
				//is doing to many tests in one time
      	$Ntests_time=time()-1800;

      	$stmt = $db  ->prepare( "SELECT TPFinal FROM DNSusers WHERE ip='$ip' AND TPFinal>$Ntests_time" );
      	$stmt ->execute();
      	$Ntests=$stmt->rowCount();

      	if($Ntests>20){
      		die("10 intentos en menos de 60 mins.");
      	}

				//We introduce data into the database in case every condition is fullfilled

      	$_SESSION['last_time']=time();

      	introduce_data($ip,$db);

      }

  }
  $time_request=$_GET['result'];

	//We do a check of the type of query that corresponds to the obtained time

  if($_SESSION['samples']>0){

  	check_sample($time_request,$db);

  }else{

		//If not we start the test

  	$_SESSION['samples']=1;

  	if($_SESSION['OS']=="Windows" || $_SESSION['OS']=="Android" || $_SESSION['OS']=="Macintosh"){

  		$code = $_SESSION[$domain];

	  	$archive="results/".$code.".txt";

			 	$file=fopen($archive,"a");

          $tp=time();

			 	 $chain=$time_request;

	   		 	$chain.=" ".$tp;

	    		fwrite($file,$chain.PHP_EOL);

	    		fclose($file);
	 }

  }

//Function to introduce the data from the test user into the database. This is done only once every test

function introduce_data($ip,$db){

       $_SESSION['validated']=0;

		  $_SESSION['samples']=0;

          $domain=$_GET['domain'];

					//We use this API to retrieve information about the IP that connected

          $web= "http://ip-api.com/json/$ip";

          $json = file_get_contents($web);

          $tp=time();

          $json_data = json_decode($json,true);

          $code=$tp;

          $code.="-".$json_data['countryCode'];

          $region=$json_data['regionName'];

          $country=$json_data['country'];

          $random_number = (rand(0,9) . rand(0,9) . rand(0,9) . rand(0,9) . rand(0,9). rand(0,9) . rand(0,9) . rand(0,9) . rand(0,9) . rand(0,9) );

          $code.="-".$random_number;

          $ciudad=$json_data['city'];

          $as=$json_data['as'];

          $org=$json_data['org'];

          $isp=$json_data['isp'];


          $_SESSION[$domain]=$code;

          $countcode=$json_data['countryCode'];

          $ISP=fisp($isp,$as,$org,$countcode);

          $browser = $_SERVER['HTTP_USER_AGENT'];

					//We use the Wolfcast tool to dtect the browser being used

          require_once('BrowserDetection.php');

          $browser = new Wolfcast\BrowserDetection();

          $navigator=$browser->getName();
	      	$platform=$browser->getPlatform();


	      if($platform=="Linux" || $platform=="iOS"){
            $_SESSION['plat']="Nope";
          }else{
            $_SESSION['plat']="Sip";
          }

         date_default_timezone_set('Europe/Madrid');
        $fecha = date("d")."-".date("m")."-".date("Y")." ".date("H").":".date("i").":".date("s");


        $peticion="INSERT INTO DNSusers (id,ip,ISP,browser,location,TPInitial,TPFinal,FInitial,FFinal,domain,ausy,org,isp,regionName,country,so) VALUES ('$code','$ip','$ISP','$browser','$ciudad',$tp,$tp,'$fecha','$fecha','$domain','$as','$org','$isp','$region','$country','$platform')";

        $insert = $db  ->prepare($peticion);
        $insert ->execute();

        $archive="results/".$code.".txt";

        $_SESSION[$domain]=$code;


}

	//Function to get the ISP of the user

	function fisp($isp,$as,$org,$ccode){


        $ISP_users=["ISP1","ISP2","ISP3","ISP4"];

        $chain_isp=explode(" ",$isp);
        $chain_as=explode(" ",$as);
        $chain_org=explode(" ",$org);

        $isp_m=strtoupper($chain_isp[0]);

        if(sizeof($chain_as)>2){
          $as_m=strtoupper($chain_as[1]);
          if(sizeof($chain_as)>4){
	         $as_m2=strtoupper($chain_as[4]);
          }
        }else{
          $as_m="bb";
        }

				//For some ISPs we use the organization and for other the autonomous systen information

        $org_m=strtoupper($chain_org[0]);

				if($org_m == $ISP_users[0]){
          $ISP_user=$org_m;
        }elseif($as_m == $ISP_users[0]){
          $ISP_user=$as_m;
        }elseif($as_m==$ISP_users[1]){
          $ISP_user=$as_m;
        }elseif($isp_m==$ISP_users[2]){
          $ISP_user=$isp_m;
        }elseif ($as_m==$ISP_users[3]) {
          $ISP_user=$as_m;
        }else{
          $ISP_user="OTHER";
        }

         if($ccode!="ES"){
        	$ISP_user="FOREIGN";
         }

        return $ISP_user;

      }

	//Function to check if the sample corresponds to a DNS request to a server or not

	function check_sample($time_request,$db){

		$samples_number=$_SESSION['samples'];
		$samples_number=$samples_number+1;
    $_SESSION['samples']=$samples_number;

    $domain=$_GET['domain'];

		 date_default_timezone_set('Europe/Madrid');
        $fecha = date("d")."-".date("m")."-".date("Y")." ".date("H").":".date("i").":".date("s");

        $tp=time();

        $code = $_SESSION[$domain];

        $r=$db -> prepare("UPDATE DNSusers SET TPFinal =$tp WHERE id = '$code'");
        $r -> execute();
        $r=$db -> prepare("UPDATE DNSusers SET FFinal ='$fecha' WHERE id = '$code'");
        $r -> execute();


//We have different thresholds depending on the type of operating system that is being used to perform the test of the network

		if($_SESSION['OS']=="Windows"){

			$treshold_1=1;
			$treshold_2=3.7;

			//In the case of windows we jhave two types of thresholds.
			//To classify possible responses by Local DNS Servers and responses by Local DNS Servers

			if($samples_number>15){

				if($_SESSION['warden2']<2 && $_SESSION['warden1']<2){

					if($time_request>$_umbral2){
						$_SESSION['warden2']+=1;
					}
					elseif($time_request>$_umbral1){
						$_SESSION['warden1']+=1;
					}
				}
				//We verify if the test should be repeated or not
				$repeat_verifier=$_SESSION['warden2']+$_SESSION['warden1'];

				if($_SESSION['warden2']>1){
					$_SESSION['veredict']=1;
				}elseif($repeat_verifier>1){
					if(isset($_SESSION['veredict'])){

						$_SESSION['veredict']=1;

					}else{

						$_SESSION['veredict']=2;

					}

				}else{
					$_SESSION['veredict']=0;
				}
				$_SESSION['validated']=1;
       			die("FFF");

			}elseif($samples_number>5 && $samples_number<10 && $_SESSION['warden2']<1 && $_SESSION['warden1']<1){


				if($time_request>$_umbral2){
					$_SESSION['warden2']+=1;
				}
				elseif($time_request>$_umbral1){
					$_SESSION['warden1']+=1;
				}


			}elseif($samples_number>10 && $samples_number<17 && $_SESSION['warden2']<2 && $_SESSION['warden1']<2){


				if($time_request>$_umbral2){
					$_SESSION['warden2']+=1;
				}
				elseif($time_request>$_umbral1){
					$_SESSION['warden1']+=1;
				}

			}

			//We have only a threshold with different values for Android and Macintosh
		}else if($_SESSION['OS']=="Android"){

			$threshold=0.6;

			if($samples_number>15){

				if($_SESSION['warden']<2){

					if($time_request>$threshold){
						$_SESSION['warden']+=1;
					}

				}

				if($_SESSION['warden']>1){
					$_SESSION['veredict']=1;
				}else{
					$_SESSION['veredict']=0;
				}

				$_SESSION['validated']=1;
       			die("FFF");

			}elseif($samples_number>5 && $samples_number<10 && $_SESSION['warden']<1){


				if($time_request>$threshold){
					$_SESSION['warden']+=1;
				}


			}elseif($samples_number>10 && $samples_number<17 && $_SESSION['warden']<2 ){


				if($time_request>$threshold){
					$_SESSION['warden']+=1;
				}

			}

		}else if($_SESSION['OS']=="Macintosh"){

			$threshold=0.4;

			if($samples_number>15){

				if($_SESSION['warden']<2){

					if($time_request>$threshold){
						$_SESSION['warden']+=1;
					}

				}

				if($_SESSION['warden']>1){
					$_SESSION['veredict']=1;
				}else{
					$_SESSION['veredict']=0;
				}

				$_SESSION['validated']=1;
       			die("FFF");

			}elseif($samples_number>5 && $samples_number<10 && $_SESSION['warden']<1){


				if($time_request>$threshold){
					$_SESSION['warden']+=1;
				}


			}elseif($samples_number>10 && $samples_number<17 && $_SESSION['warden']<2 ){


				if($time_request>$threshold){
					$_SESSION['warden']+=1;
				}

			}

		}else{

			$code="NotUse";

		}

		//We save the results into a file with the timestamp and an ID


		if($code!="NotUse"){
			$archive="results/".$code.".txt";

		 	$file=fopen($archive,"a");

		 	 $chain=$time_request;

   		 	$chain.=" ".$tp;

    		fwrite($file,$chain.PHP_EOL);

    		fclose($file);

        print("OK");
    	}
}


?>
