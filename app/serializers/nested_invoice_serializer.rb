class NestedInvoiceSerializer < ApplicationSerializer
  attributes :id,
  :kind,
  :status,
  :payment_status,
  :payment_type,
  :commission_paid,
  :check,
  :discount,
  :deposit,
  :tip,
  :refund,
  :sub_total,
  :total,
  :balance

  has_many :lines, serializer: NestedLineSerializer
end
