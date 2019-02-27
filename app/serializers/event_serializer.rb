class EventSerializer < ActiveModel::Serializer
  attributes :id, :action, :break, :break_start, :client, :call_time, :clock_out, :confirmation, :creator, :description, :driving_time, :end, :gc_id, :html_link, :i_cal_UID, :kind, :notes, :start, :summary, :tags
  belongs_to :client, foreign_key: true, serializer: NestedClientSerializer
  has_one :invoice, serializer: NestedInvoiceSerializer
  has_one :place_location, serializer: NestedPlaceLocationSerializer
  has_one :place_call_location, serializer: NestedPlaceCallLocationSerializer
  has_one :creator, serializer: ContactSerializer
  has_many :event_employees, key:'staff', serializer: NestedEventEmployeeSerializer
end
