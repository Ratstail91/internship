#!/usr/bin/perl

use strict;
use warnings;

use DBI;
use Person;

sub dump_database {
	my ($sthandle) = @_;
	my @dbdump;
	while(my @row = $sthandle->fetchrow_array()) {
		my $person = Person->new(
			fname => $row[0],
			lname => $row[1],
			email => $row[2]
		);
		push @dbdump, $person;
	}
	return @dbdump;
};

1;
