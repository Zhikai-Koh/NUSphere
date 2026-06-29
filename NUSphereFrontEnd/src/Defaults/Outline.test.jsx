import {describe, it, expect, vi, beforeEach} from "vitest";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Outline } from "./Outline.jsx";
import axios from "axios";

vi.mock("axios");

vi.mock("../LoginPage/ProfileDropDown", () => ({
    ProfileDropdown: () => <div data-testid="profile-dropdown">Profile Mock</div>
}));

vi.mock("../UserSpecifics/CartButton.jsx", () => ({
    CartButton: () => <button data-testid="cart-button">Cart Mock</button>
}));

describe("Outline Component - Rendering & UI States", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    })

    it("renders all 9 categories successfully", () => {
        render(
            <MemoryRouter>
                <Outline />
            </MemoryRouter>
        );

        const expectedCategories = [
            'All',
            'Electronics',
            'Fashion',
            'Furniture',
            'Academics',
            'Dorm Living',
            'Services & Collaboration',
            'Food',
            'Others'
        ];

        expectedCategories.forEach(category => {
            expect(screen.getByText(category)).toBeInTheDocument();
        });
    });

    it("renders the static NUSphere assets with the correct alt attributes", () => {
        render(
            <MemoryRouter>
                <Outline />
            </MemoryRouter>
        );

        const logo = screen.getByAltText('NUSphere Logo');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveClass('nusphere-logo');

        const nameImage = screen.getByAltText('NUSphere Name');
        expect(nameImage).toBeInTheDocument();
        expect(nameImage).toHaveClass('nusphere-name');
    });

    it("changes the active category when Electronics is clicked", () => {
        render(
            <MemoryRouter>
                <Outline />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Electronics"));

        const electronicsCard = screen
            .getByText("Electronics")
            .closest(".category-card");

        const allCard = screen
            .getByText("All")
            .closest(".category-card");

        expect(electronicsCard).toHaveClass("active");
        expect(allCard).not.toHaveClass("active");
    });
    
    it("fetches the profile when a token exists", async () => {
        localStorage.setItem("access_token", "fake-token");

        axios.get.mockResolvedValue({
            data: {
                username: "Bob"
            }
        });

        render(
            <MemoryRouter>
                <Outline />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining("/api/auth/profile/"),
            expect.objectContaining({
                headers: {
                    Authorization: "Bearer fake-token"
                }
            })
        );
    });

    it("handles profile fetch failure", async () => {
        localStorage.setItem("access_token", "fake-token");

        axios.get.mockRejectedValue(new Error("Network Error"));

        const spy = vi.spyOn(console, "error").mockImplementation(() => {});

        render(
            <MemoryRouter>
                <Outline />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(spy).toHaveBeenCalled();
        });

        spy.mockRestore();
    });
});
