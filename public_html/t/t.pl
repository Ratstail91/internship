#!/usr/bin/perl
use strict;
use warnings;

use Test::More tests => 14;

use_ok('Person');

can_ok('Person', 'SetFirstName');
can_ok('Person', 'SetLastName');
can_ok('Person', 'SetEmail');
can_ok('Person', 'GetFirstName');
can_ok('Person', 'GetLastName');
can_ok('Person', 'GetEmail');


my $person = new_ok('Person');

is($person->SetFirstName('Kayne'), 'Kayne', 'Person::SetFirstName() works');
is($person->SetLastName('Ruse'), 'Ruse', 'Person::SetLastName() works');
is($person->SetEmail('kayne@qps.com'), 'kayne@qps.com', 'Person::SetEmail() works');

is($person->GetFirstName('Kayne'), 'Kayne', 'Person::GetFirstName() works');
is($person->GetLastName('Ruse'), 'Ruse', 'Person::GetLastName() works');
is($person->GetEmail('kayne@qps.com'), 'kayne@qps.com', 'Person::GetEmail() works');


