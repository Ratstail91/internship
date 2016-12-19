#!/usr/bin/perl

use strict;
use warnings;

use Test::More tests => 32;

#includes
use DBI;
use CGI 'param';
use JSON;
use JSON::Parse ':all';
use_ok('Person');
use Template;

##connect to the database
my $dbhandle = DBI->connect('dbi:mysql:database=test;localhost',,,{AutoCommit=>1,RaiseError=>1,PrintError=>1});

ok(defined $dbhandle, 'Connected to the database');

##test entry.cgi

#pass entry.cgi some parameters, surpressing the output
param('fname', 'foo');
param('lname', 'bar');
param('email', 'foobar@qps.com');
param('birthdate','1995-07-21');
param('income','1337');

open(my $nullFH, '>', '/dev/null');
my $stdoutFH = select $nullFH;

require_ok('entry.cgi');

select $stdoutFH;
close $nullFH;

#find those debugging values
my $sthandle = $dbhandle->prepare(
	'SELECT fname,lname,email,birthdate,income FROM mailinglist WHERE
	fname = "foo" AND
	lname = "bar" AND
	email = "foobar@qps.com" AND
	birthdate = "1995-07-21" AND
	income = 1337
	;');

$sthandle->execute() or die $DBI::errstr;

my $varcount = 0;
while(my @row = $sthandle->fetchrow_array()) {
	$varcount++;
}

$sthandle->finish();

is($varcount, 1, 'Number of debugging entries found (entry.cgi)');

##test dump_database.cgi
require_ok('dump_database.cgi');

$sthandle = $dbhandle->prepare('SELECT fname, lname, email, birthdate, income FROM mailinglist;');
$sthandle->execute();
my @dbdump = dump_database($sthandle);
$sthandle->finish();

#check the dump
$varcount = 0;
	foreach my $row (@dbdump) {
		if (%$row->{fname} eq 'foo' and %$row->{lname} eq 'bar' and %$row->{email} eq 'foobar@qps.com' and %$row->{birthdate} eq '1995-07-21' and %$row->{income} == 1337) {
		$varcount++;
	}
}
is($varcount, 1, 'Number of debugging entries found (dump_database.cgi)');

##test refresh.cgi

#get the output from refresh.cgi
my $output;
open(my $outputFH, '>', \$output) or die;
my $oldFH = select $outputFH;

do('refresh.cgi');

select $oldFH;
close $outputFH;

#output = string, output2 = array, output3 = string, screendump = array
my @screendump;
{
	my @output2 = grep {/\S/} split("\n",$output);
	shift @output2;
	my $output3 = join("\n",@output2);
	@screendump = parse_json($output3);
}

#compare dbdump to screendump
my $ret = 1;
for (my $i = 0; $i < @dbdump; $i++) {
	while (my ($key, $value) = each $screendump[0][$i]) {
		#avoid mixing perl's operator types
		if ($dbdump[$i]{$key} ne $value) {
			$ret = 0;
			print($dbdump[$i]{$key}, $value);
		}
	}
}

is($ret, 1, 'screendump matches the database dump');

##test Person.pm
can_ok('Person', 'SetFirstName');
can_ok('Person', 'SetLastName');
can_ok('Person', 'SetEmail');
can_ok('Person', 'SetBirthdate');
can_ok('Person', 'SetIncome');

can_ok('Person', 'GetFirstName');
can_ok('Person', 'GetLastName');
can_ok('Person', 'GetEmail');
can_ok('Person', 'GetBirthdate');
can_ok('Person', 'GetIncome');

my $person = Person->new;
ok($person->SetFirstName('kayne') eq 'kayne', 'Person::SetFirstName()');
ok($person->SetLastName('ruse') eq 'ruse', 'Person::SetLastName()');
ok($person->SetEmail('kayneruse@gmail.com') eq 'kayneruse@gmail.com', 'Person::SetEmail()');
ok($person->SetBirthdate('1991-08-08') eq '1991-08-08', 'Person::SetBirthdate()');
ok($person->SetIncome(30000) == 30000, 'Person::SetIncome()');

ok($person->GetFirstName() eq 'kayne', 'Person::GetFirstName()');
ok($person->GetLastName() eq 'ruse', 'Person::GetLastName()');
ok($person->GetEmail() eq 'kayneruse@gmail.com', 'Person::GetEmail()');
ok($person->GetBirthdate() eq '1991-08-08', 'Person::GetBirthdate()');
ok($person->GetIncome() == 30000, 'Person::GetIncome()');

##check that the front end can parse the given JSON

#output unordered list to a string
my $template = Template->new({
	INCLUDE_PATH => ['/var/www/helloworld.qps.local/public_html']
});

$output = '';
$template->process("unordered_list.tt", {entries => \@dbdump}, \$output);

#get check how many lines correspond to the debug entry
my @lines = grep { /<li>.*foobar\@qps.com.*<\/li>/ } split("\n", $output);
is(scalar @lines, 1, "Result parsed from the front end");

##Check the return codes from the server

is(`curl -s -o /dev/null -I -w "%{http_code}" island.krgamestudios.com`, 200, 'return code 200');
is(`curl -s -o /dev/null -I -w "%{http_code}" island.krgamestudios.com/t/missing`, 404, 'return code 404');
is(`curl -s -o /dev/null -I -w "%{http_code}" island.krgamestudios.com/t/broken.cgi`, 500, 'return code 500');

##test the front end (done in JavaScript)

my $fullresults = `node t/node_modules/karma/bin/karma start t/karma.conf.js`;
my @results = grep { /.*Executed 2 of 2 SUCCESS.*/ } $fullresults;

ok(@results != 0, '2/2 Reported from JavaScript front end');

if (@results == 0) {
	print $fullresults;
}

##Remove those debugging values from the database
$sthandle = $dbhandle->prepare('DELETE FROM mailinglist WHERE fname = "foo" AND lname = "bar";');
$sthandle->execute() or die $DBI::errstr;
$sthandle->finish();

##finally
$dbhandle->disconnect();
