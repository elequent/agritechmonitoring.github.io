    <?php
    // connect and login to FTP server
    $ftp_server = "ftp.nrie.com.au";
    $ftp_conn = ftp_connect($ftp_server) or die("Could not connect to $ftp_server");
    $ftp_username = 'agtech@nrie.com.au';
    $ftp_userpass = 'a9t3ch';
    $login = ftp_login($ftp_conn, $ftp_username, $ftp_userpass);

    $local_file = "Files/b1rain.csv";
    $server_file = "AGT2/b1rain.csv";

    // download server file
    if (ftp_get($ftp_conn, $local_file, $server_file, FTP_ASCII))
    {
        echo "Successfully written to $local_file.";
    }
    else
    {
    	echo "Error downloading $server_file.";
    }
    $local_file = "Files/b1temp.csv";
    $server_file = "AGT2/b1temp.csv";

    // download server file
    if (ftp_get($ftp_conn, $local_file, $server_file, FTP_ASCII))
    {
        echo "Successfully written to $local_file.";
    }
    else
    {
    	echo "Error downloading $server_file.";
    }
    $local_file = "Files/b1moist.csv";
    $server_file = "AGT2/b1moist.csv";

    // download server file
    if (ftp_get($ftp_conn, $local_file, $server_file, FTP_ASCII))
    {
        echo "Successfully written to $local_file.";
    }
    else
    {
    	echo "Error downloading $server_file.";
    }


    // close connection
    ftp_close($ftp_conn);
    ?>