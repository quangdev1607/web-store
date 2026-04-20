using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TiemBanhBeYeu.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddProvinceAndWardNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProvinceName",
                table: "Users",
                type: "TEXT",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WardName",
                table: "Users",
                type: "TEXT",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProvinceName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "WardName",
                table: "Users");
        }
    }
}
