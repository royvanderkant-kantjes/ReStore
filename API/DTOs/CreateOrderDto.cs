using API.Entities.OrderAggregate;

namespace API.DTOs;

public class CreateOrderDto
{
    public Boolean SaveAddress { get; set; }
    public ShippingAddress ShippingAddress { get; set; }
}
