#!/usr/bin/perl
use strict;
use warnings;
use DBI;
use Template;
use Data::Dumper;
use CGI ":standard";
use Person;

#includes
require "dump_database.cgi";

#setup the page's components
my $template = Template->new({
	INCLUDE_PATH => ['/var/www/helloworld.qps.local/public_html'],
});

my $dbhandle = DBI->connect('dbi:mysql:database=test;localhost',,,{AutoCommit=>1,RaiseError=>1,PrintError=>1});

#retrieve the query from the test database
my $sthandle = $dbhandle->prepare("SELECT fname, lname, email FROM mailinglist;");

$sthandle->execute() or die $DBI::errstr;

#print the beginning of the page, including the number of rows
$template->process("index_begin.tt",{
	rows => $sthandle->rows
});

#save the rows and disconnect from the database
my @dbdump = dump_database($sthandle);

$sthandle->finish();
$dbhandle->disconnect();

#print the dumped database to the screen
$template->process("unordered_list.tt", {
	entries => \@dbdump
});

#show the input field
$template->process("form_list.tt", {
	fname => "fname",
	lname => "lname",
	email => "email"
});

#finish off the html page
$template->process("index_end.tt", {});
