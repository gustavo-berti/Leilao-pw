package com.github.gustavo_berti.back_end.specifications;

import java.util.Date;

import org.springframework.data.jpa.domain.Specification;

import com.github.gustavo_berti.back_end.models.Auction;
import com.github.gustavo_berti.back_end.models.enums.AuctionStatus;

import jakarta.persistence.criteria.Predicate;

public class AuctionSpecification {

    public static Specification<Auction> withFilters(String title, Date dateHourEnd,
            Long categoryId, AuctionStatus status) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            if (title != null && !title.isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("title")),
                                "%" + title.toLowerCase() + "%"));
            }

            if (dateHourEnd != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.lessThanOrEqualTo(root.get("dateHourEnd"), dateHourEnd));
            }

            if (categoryId != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("category").get("id"), categoryId));
            }

            if (status != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("status"), status));
            }

            return predicate;
        };
    }
}