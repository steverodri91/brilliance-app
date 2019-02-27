require 'csv'

Contact.destroy_all
Company.destroy_all
Place.destroy_all
EmailAddress.destroy_all
Address.destroy_all
Client.destroy_all
Event.destroy_all
Invoice.destroy_all
Employee.destroy_all
EventEmployee.destroy_all

#seed Contacts
csv_text = File.read(Rails.root.join('lib','seeds', 'Contacts.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Contact.create! ({
    photo: row['photo'],
    prefix: row['prefix'],
    first_name: row['first_name'],
    last_name: row['last_name'],
    phone_number: row['phone_number'],
    work_email: row['work_email'],
    ss: row['ss'],

    created_at: row['created_at']
  })
end
puts "There are now #{Contact.count} rows in the Contacts table"

#seed Companies
csv_text = File.read(Rails.root.join('lib','seeds', 'Companies.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Company.create! ({
    name: row['name'],
    logo: row['logo'],
    website: row['website'],
    phone_number: row['phone_number'],

    created_at: row['created_at']
  })
end
puts "There are now #{Company.count} rows in the Companies table"

#seed Addresses
csv_text = File.read(Rails.root.join('lib','seeds', 'Addresses.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Address.create! ({
    address: row['address'],

    created_at: row['created_at']
  })
end
puts "There are now #{Address.count} rows in the Addresses table"

#seed Places
csv_text = File.read(Rails.root.join('lib','seeds', 'Places.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Place.create! ({
    installation: row['installation'],
    photo: row['photo'],
    name: row['name'],
    short_name: row['short_name'],
    commission: row['commission'],

    address_id: row['address_id'],
    company_id: row['company_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{Place.count} rows in the Places table"

#seed Email Addresses
csv_text = File.read(Rails.root.join('lib','seeds', 'Email_Addresses.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  EmailAddress.create! ({
    email_address: row['email_address'],

    contact_id: row['contact_id'],
    company_id: row['company_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{EmailAddress.count} rows in the Email Addresses table"

#seed Clients
csv_text = File.read(Rails.root.join('lib','seeds', 'Clients.csv'))
csv = CSV.parse(csv_text, :headers => true, :skip_blanks => false, :encoding => 'ISO-8859-1')
csv.each do |row|
  Client.create! ({
    contact_id: row['contact_id'],
    company_id: row['company_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{Client.count} rows in the Clients table"

#seed Events
csv_text = File.read(Rails.root.join('lib','seeds', 'Events.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Event.create! ({
    action: row['action'],
    break: row['break'],
    break_start: row['break_start_tz'],
    call_time: row['call_time_tz'],
    clock_out: row['clock_out_tz'],
    confirmation: row['confirmation'],
    description: row['description'],
    driving_time: row['driving_time'],
    end: row['event_end_tz'],
    kind: row['kind'],
    notes: row['notes'],
    start: row['event_start_tz'],
    summary: row['summary'],
    tags: row['tags'],

    location_id: row['location_id'],
    call_location_id: row['call_location_id'],
    client_id: row['client_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{Event.count} rows in the Events table"

#seed Invoices
csv_text = File.read(Rails.root.join('lib','seeds', 'Invoices.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Invoice.create! ({
    kind: row['type'],
    status: row['status'],
    payment_status: row['payment_status'],
    payment_type: row['payment_type'],
    commission_actual: row['commission_actual'],
    commission_paid: row['commission_paid'],
    check_info: row['check_info'],
    discount: row['discount'],
    deposit: row['deposit'],
    tip: row['tip'],
    refund: row['refund'],

    event_id: row['event_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{Invoice.count} rows in the Invoices table"

#seed Employee
csv_text = File.read(Rails.root.join('lib','seeds', 'Staff.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Employee.create! ({
    active?: row['active_inactive'],
    labor?: row['labor'],
    rate_hand_per_job: row['rate_hand_per_job'],
    rate_full_job: row['rate_full_job'],
    rate_on_premise_one_man: row['rate_on_premise_one_man'],
    rate_on_premise: row['rate_on_premise'],
    rate_hourly: row['rate_hourly'],
    rate_hourly_office_shop: row['rate_hourly_office_shop'],
    rate_demo: row['rate_demo'],


    contact_id: row['contact_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{Employee.count} rows in the Employees table"

#seed EventEmployee
csv_text = File.read(Rails.root.join('lib','seeds', 'Event_Staff.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  EventEmployee.create! ({
    confirmation: row['confirmation'],
    paid?: row['paid?'],
    position: row['position'],
    rate: row['rate'],
    clock_in: row['clock_in'],
    clock_out: row['clock_out'],
    break_minutes: row['break_minutes'],
    break?: row['break?'],
    hourly?: row['hourly?'],

    employee_id: row['staff_id'],
    event_id: row['event_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{EventEmployee.count} rows in the EventEmployees table"
