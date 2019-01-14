require 'csv'

Client.destroy_all
Event.destroy_all
Invoice.destroy_all
Contact.destroy_all
Company.destroy_all
EmailAddress.destroy_all
Address.destroy_all
Place.destroy_all

#seed Contacts
csv_text = File.read(Rails.root.join('lib','seeds', 'Contacts.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Contact.create! ({
    photo: row['Photo'],
    prefix: row['Prefix'],
    first_name: row['First_Name'],
    last_name: row['Last_Name'],
    phone_number: row['Phone_Number'],
    work_email: row['Work_Email'],
    ss: row['SS'],

    created_at: row['created_at']
  })
end
puts "There are now #{Contact.count} rows in the Contact table"

#seed Companies
csv_text = File.read(Rails.root.join('lib','seeds', 'Companies.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Company.create! ({
    name: row['Name'],
    logo: row['Logo'],
    website: row['Website'],
    phone_number: row['Phone_Number'],

    created_at: row['created_at']
  })
end
puts "There are now #{Company.count} rows in the Company table"

#seed Addresses
csv_text = File.read(Rails.root.join('lib','seeds', 'Addresses.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Address.create! ({
    address: row['Address'],

    created_at: row['created_at']
  })
end
puts "There are now #{Address.count} rows in the Addresses table"

#seed Places
csv_text = File.read(Rails.root.join('lib','seeds', 'Places.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  Place.create! ({
    installation: row['Install'],
    photo: row['Photo'],
    name: row['Name'],
    short_name: row['Short_Name'],
    commission: row['Commission'],

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
    address: row['Email_Address'],

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
    action: row['Action'],
    break: row['Break'],
    break_start: row['Break_Start'],
    call_time: row['Call_Time'],
    clock_out: row['Clock_Out'],
    confirmation: row['Confirmation'],
    description: row['Description'],
    driving_time: row['Driving_Time'],
    end: row['Event_End'],
    kind: row['Kind'],
    notes: row['Notes'],
    start: row['Event_Start'],
    summary: row['Summary'],
    tags: row['Tags'],

    location_id: row['place_id'],
    call_location_id: row['place_id(Call)'],
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
    kind: row['Type'],
    status: row['Status'],
    payment_status: row['Payment_Status'],
    payment_type: row['Payment_Type'],
    commission_paid: row['Commission_Paid'],
    check_info: row['Check_Info'],
    discount: row['Discount'],
    tip: row['Tip'],

    event_id: row['event_id'],
    created_at: row['created_at']
  })
end
puts "There are now #{Invoice.count} rows in the Invoices table"
